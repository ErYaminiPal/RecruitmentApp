package net.marsbytes.app.recruitment.domain;

import static org.assertj.core.api.Assertions.assertThat;

import net.marsbytes.app.recruitment.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class JobPositionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(JobPosition.class);
        JobPosition jobPosition1 = new JobPosition();
        jobPosition1.setId(1L);
        JobPosition jobPosition2 = new JobPosition();
        jobPosition2.setId(jobPosition1.getId());
        assertThat(jobPosition1).isEqualTo(jobPosition2);
        jobPosition2.setId(2L);
        assertThat(jobPosition1).isNotEqualTo(jobPosition2);
        jobPosition1.setId(null);
        assertThat(jobPosition1).isNotEqualTo(jobPosition2);
    }
}
